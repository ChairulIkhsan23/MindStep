# AI Prompt Architecture Audit & Hardening Plan

## 1. Audit Existing Implementation

### A. Kondisi Saat Ini
1. **File Prompt**:
   - `prompts/system_persona.yaml`: Metadata minim (`name`, `description`, `version`, `parameters.temperature`, `content`).
   - `prompts/polish_draft.yaml`: Metadata minim (`name`, `description`, `version`, `parameters`, `variables`, `content`).
   - `prompts/deepening_prompts.yaml`: Metadata minim, content masih hardcoded template.
   - `prompts/periodic_summary.yaml`: Metadata minim.
2. **Parser & Builder**:
   - Menggunakan `symfony/yaml` via static method di `app/Services/Ai/PromptBuilder.php`.
   - Menggunakan `base_path("prompts/{$filename}")` tanpa sanitasi nama file (potensi path traversal jika filename dinamis).
   - Substitusi variabel sederhana via `str_replace(':content', ...)`:
     - Rentan bila konten pengguna secara kebetulan memuat `:content` atau placeholder lain.
     - Tidak ada validasi required vs optional variables (jika variable required tidak diisi, teks `:content` tetap menempel di prompt mentah).
     - Tidak ada schema validation untuk struktur berkas YAML (misal: jika key `content` hilang, fallback ke string kosong tanpa exception jelas).
3. **Parameter Model**:
   - Nilai `temperature` dan `max_tokens` di YAML saat ini **diabaikan/tidak dikonsumsi** oleh driver! Driver `OpenAiDriver` dan `GeminiAiDriver` masih hardcode `temperature => 0.7` di level HTTP request.
4. **Alur Prompt Assembly**:
   - Driver memanggil `PromptBuilder::polish()` yang hanya mengembalikan user prompt string, lalu driver menambahkan system persona secara terpisah atau menggabungkannya.
   - Pemisahan `system` vs `user` message belum konsisten di semua driver.

---

## 2. Standard Schema Desain YAML (`prompts/*.yaml`)

Setiap prompt YAML mengikuti skema terstandarisasi:
```yaml
id: "polish_draft"
name: "Polish Draft"
version: "1.0.0"
description: "Memoles draf poin kasar jurnal menjadi narasi reflektif tanpa mengubah substansi fakta"
purpose: "refinement"

parameters:
  temperature: 0.7
  max_tokens: 1500

variables:
  required:
    - content
  optional:
    - context

messages:
  - role: system
    content: |
      Kamu adalah Mindstep Reflective AI...
  - role: user
    content: |
      Draf jurnal:
      <user_content>
      {{ content }}
      </user_content>
      {% if context %}
      Konteks tambahan:
      {{ context }}
      {% endif %}

output:
  format: "text" # or "json_array"
  constraints:
    - "Tidak boleh menambah fakta fiktif"
    - "Tidak boleh merubah sudut pandang penulis"
```

---

## 3. Rencana Arsitektur & Kelas Baru

### A. Dedicated Exception Classes (`app/Services/Ai/Exceptions/`)
- `PromptNotFoundException`: Ketika file YAML tidak ditemukan atau path di luar direktori aman.
- `InvalidPromptSchemaException`: Ketika struktur YAML tidak lengkap (id, parameters, content/messages missing).
- `MissingPromptVariableException`: Ketika variabel required tidak disediakan.
- `PromptParseException`: Ketika berkas YAML corrupt/sintaks rusak.

### B. `app/Services/Ai/PromptConfig.php` (Value Object)
Membungkus data YAML yang tervalidasi:
- `$id`, `$name`, `$version`, `$parameters` (`temperature`, `max_tokens`), `$requiredVariables`, `$optionalVariables`, `$systemPrompt`, `$userPromptTemplate`, `$outputFormat`.

### C. `app/Services/Ai/PromptBuilder.php` (Refactored Service & Static Facade)
- Menggunakan path resolver aman (`realpath` constraint di dalam `base_path('prompts')` untuk mencegah traversal).
- Validasi skema ketat (Fail-fast).
- Variable injection aman dengan delimiter unik `{{ variable_name }}` (bukan `:variable` yang rentan tabrakan dengan teks jam/waktu seperti `12:00`).
- Membaca dan memvalidasi `required` vs `optional` variables.
- Membungkus konten pengguna dengan batas semantik (e.g. `<user_content>...</user_content>`) untuk mitigasi prompt injection dasar.

---

## 4. Rencana Pengujian Komprehensif

File test: `tests/Unit/Ai/PromptBuilderTest.php` & `tests/Feature/Ai/PromptYamlIntegrityTest.php`:
1. Validasi integritas seluruh berkas YAML di `prompts/`.
2. Test proteksi path traversal (`../../etc/passwd` atau `../secret.yaml`).
3. Test exception saat berkas YAML tidak ditemukan (`PromptNotFoundException`).
4. Test exception saat format YAML rusak/malformed (`PromptParseException`).
5. Test exception saat schema tidak lengkap (`InvalidPromptSchemaException`).
6. Test missing required variable (`MissingPromptVariableException`).
7. Test substitusi variabel sukses (required + optional).
8. Test isolasi konten pengguna (delimiter injection safety).
9. Test kompatibilitas `AiAssistantTest` (129 existing tests tetap passed 100%).
