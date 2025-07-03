<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:50|min:2',
            'last_name' => 'required|string|max:50|min:2',
            'subject' => 'required|string|max:100|min:2',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'El nombre es obligatorio.',
            'first_name.min' => 'El nombre debe tener al menos 2 caracteres.',
            'last_name.required' => 'El apellido es obligatorio.',
            'last_name.min' => 'El apellido debe tener al menos 2 caracteres.',
            'subject.required' => 'La materia es obligatoria.',
            'subject.min' => 'La materia debe tener al menos 2 caracteres.',
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'first_name' => trim($this->first_name),
            'last_name' => trim($this->last_name),
            'subject' => trim($this->subject),
        ]);
    }
}
