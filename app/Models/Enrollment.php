<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'enrollment_id';

    protected $fillable = [
        'tenant_id',
        'student_id',
        'course_id',
        'enrollment_date' // Assuming you want to track when the enrollment was made
    ];
}
