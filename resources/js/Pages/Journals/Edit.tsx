import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Edit() {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Edit Jurnal</h2>}>
            <Head title="Edit Jurnal" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <p className="text-gray-900 dark:text-gray-100">Edit journal placeholder.</p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
