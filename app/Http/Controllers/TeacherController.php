<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function index(): Response
    {
        try {
            $tenantId = Auth::user()->tenant_id;
            $teachers = Teacher::forTenant($tenantId)
                ->orderBy('last_name', 'asc')
                ->orderBy('first_name', 'asc')
                ->get();

            return Inertia::render('teacher/index', [
                'teachers' => $teachers,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading teachers: ' . $e->getMessage());
            return Inertia::render('teacher/index', [
                'teachers' => [],
                'error' => 'Error al cargar los profesores.'
            ]);
        }
    }

    public function store(StoreTeacherRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $validated = $request->validated();
            $validated['tenant_id'] = Auth::user()->tenant_id;

            Teacher::create($validated);

            DB::commit();

            return redirect()
                ->route('teachers.index')
                ->with('success', 'Profesor creado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating teacher: ' . $e->getMessage());
            
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Error al crear el profesor. Inténtalo de nuevo.']);
        }
    }

    public function update(UpdateTeacherRequest $request, int $id): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $teacher = Teacher::forTenant(Auth::user()->tenant_id)->findOrFail($id);
            $validated = $request->validated();
            
            $teacher->update($validated);

            DB::commit();

            return redirect()
                ->route('teachers.index')
                ->with('success', 'Profesor actualizado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating teacher: ' . $e->getMessage());
            
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Error al actualizar el profesor. Inténtalo de nuevo.']);
        }
    }

    public function destroy(int $id): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $teacher = Teacher::forTenant(Auth::user()->tenant_id)->findOrFail($id);
            
            // Check if teacher has courses assigned
            if ($teacher->courses()->exists()) {
                return redirect()
                    ->back()
                    ->withErrors(['error' => 'No se puede eliminar el profesor porque tiene cursos asignados.']);
            }

            $teacher->delete();

            DB::commit();

            return redirect()
                ->route('teachers.index')
                ->with('success', 'Profesor eliminado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting teacher: ' . $e->getMessage());
            
            return redirect()
                ->back()
                ->withErrors(['error' => 'Error al eliminar el profesor. Inténtalo de nuevo.']);
        }
    }
}
