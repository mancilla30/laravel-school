import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState, useCallback } from 'react';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

interface Teacher {
    teacher_id: number;
    tenant_id: number;
    first_name: string;
    last_name: string;
    subject: string;
}

interface PageProps {
    teachers: Teacher[];
    success?: string;
    error?: string;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profesores',
        href: '/teachers',
    },
];

const emptyForm = { first_name: '', last_name: '', subject: '' };
type FormState = typeof emptyForm & { id?: number };

export default function TeacherIndex() {
    const { teachers, success, error } = usePage<PageProps>().props;
    const teacherList = teachers ?? [];

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const validateForm = useCallback((): boolean => {
        const errors: Record<string, string> = {};

        if (!form.first_name.trim()) {
            errors.first_name = 'El nombre es obligatorio';
        } else if (form.first_name.trim().length < 2) {
            errors.first_name = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!form.last_name.trim()) {
            errors.last_name = 'El apellido es obligatorio';
        } else if (form.last_name.trim().length < 2) {
            errors.last_name = 'El apellido debe tener al menos 2 caracteres';
        }

        if (!form.subject.trim()) {
            errors.subject = 'La materia es obligatoria';
        } else if (form.subject.trim().length < 2) {
            errors.subject = 'La materia debe tener al menos 2 caracteres';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [form]);

    const handleOpen = useCallback(() => {
        setForm(emptyForm);
        setIsEdit(false);
        setFormErrors({});
        setOpen(true);
    }, []);

    const handleOpenEdit = useCallback((teacher: Teacher) => {
        setForm({
            id: teacher.teacher_id,
            first_name: teacher.first_name,
            last_name: teacher.last_name,
            subject: teacher.subject,
        });
        setIsEdit(true);
        setFormErrors({});
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
        setForm(emptyForm);
        setIsEdit(false);
        setFormErrors({});
        setIsLoading(false);
    }, []);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Clear specific field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [formErrors]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isLoading) return;

        setIsLoading(true);

        const trimmedForm = {
            ...form,
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            subject: form.subject.trim(),
        };

        if (isEdit && form.id) {
            router.put(`/teachers/${form.id}`, trimmedForm, {
                onSuccess: handleClose,
                onError: () => setIsLoading(false),
            });
        } else {
            router.post('/teachers', trimmedForm, {
                onSuccess: handleClose,
                onError: () => setIsLoading(false),
            });
        }
    }, [form, isEdit, isLoading, validateForm, handleClose]);

    const handleDelete = useCallback((id: number, fullName: string) => {
        if (confirm(`¿Estás seguro de que quieres eliminar al profesor ${fullName}?`)) {
            router.delete(`/teachers/${id}`);
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card className='p-6 mt-6'>
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                        Profesores
                    </h1>
                    <Button
                        onClick={handleOpen}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Profesor
                    </Button>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className='overflow-x-auto'>
                    {teacherList.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No hay profesores registrados.
                        </div>
                    ) : (
                        <table className='min-w-full border text-sm rounded-lg'>
                            <thead className='bg-gray-100 dark:bg-neutral-800'>
                                <tr>
                                    <th className='px-4 py-3 text-left font-semibold'>ID</th>
                                    <th className='px-4 py-3 text-left font-semibold'>Nombre</th>
                                    <th className='px-4 py-3 text-left font-semibold'>Apellido</th>
                                    <th className='px-4 py-3 text-left font-semibold'>Materia</th>
                                    <th className='px-4 py-3 text-center font-semibold'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white dark:bg-gray-800'>
                                {teacherList.map((teacher) => (
                                    <tr
                                        key={teacher.teacher_id}
                                        className='border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors'
                                    >
                                        <td className='px-4 py-3 font-medium'>{teacher.teacher_id}</td>
                                        <td className='px-4 py-3'>{teacher.first_name}</td>
                                        <td className='px-4 py-3'>{teacher.last_name}</td>
                                        <td className='px-4 py-3'>{teacher.subject}</td>
                                        <td className='px-4 py-3'>
                                            <div className='flex justify-center gap-2'>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleOpenEdit(teacher)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(
                                                        teacher.teacher_id,
                                                        `${teacher.first_name} ${teacher.last_name}`
                                                    )}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {/* Dialog Form */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? 'Actualizar Profesor' : 'Agregar Profesor'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className="space-y-2">
                            <Label htmlFor="first_name">Nombre *</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre"
                                className={formErrors.first_name ? "border-red-500" : ""}
                                disabled={isLoading}
                            />
                            {formErrors.first_name && (
                                <p className="text-sm text-red-500">{formErrors.first_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="last_name">Apellido *</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                placeholder="Ingrese el apellido"
                                className={formErrors.last_name ? "border-red-500" : ""}
                                disabled={isLoading}
                            />
                            {formErrors.last_name && (
                                <p className="text-sm text-red-500">{formErrors.last_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Materia *</Label>
                            <Input
                                id="subject"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Ingrese la materia"
                                className={formErrors.subject ? "border-red-500" : ""}
                                disabled={isLoading}
                            />
                            {formErrors.subject && (
                                <p className="text-sm text-red-500">{formErrors.subject}</p>
                            )}
                        </div>

                        <div className='flex justify-end gap-2 pt-4'>
                            <Button
                                type="button"
                                variant='outline'
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Agregar')}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    )
}
