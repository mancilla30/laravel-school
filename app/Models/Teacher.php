<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'teacher_id';

    protected $fillable = [
        'tenant_id',
        'first_name',
        'last_name', // Assuming you want to track the teacher's last name
        'subject' // Assuming you want to track the subject the teacher teaches
    ];
}
