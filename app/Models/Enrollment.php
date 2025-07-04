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

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'enrollment_date' => 'date',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($enrollment) {
            if (is_null($enrollment->enrollment_date)) {
                $enrollment->enrollment_date = now()->format('Y-m-d');
            }
        });
    }
}
