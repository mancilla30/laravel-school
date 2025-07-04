<?php

use App\Models\Enrollment;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('sets enrollment_date to current date when creating a new enrollment without explicit date', function () {
    $enrollment = Enrollment::create([
        'tenant_id' => 1,
        'student_id' => 1,
        'course_id' => 1,
    ]);

    expect($enrollment->enrollment_date->format('Y-m-d'))->toBe(now()->format('Y-m-d'));
});

it('preserves explicitly set enrollment_date', function () {
    $specificDate = '2024-01-15';
    $enrollment = Enrollment::create([
        'tenant_id' => 1,
        'student_id' => 1,
        'course_id' => 1,
        'enrollment_date' => $specificDate,
    ]);

    expect($enrollment->enrollment_date->format('Y-m-d'))->toBe($specificDate);
});

it('can create enrollment using factory with default date', function () {
    $enrollment = Enrollment::factory()->create();

    expect($enrollment->enrollment_date->format('Y-m-d'))->toBe(now()->format('Y-m-d'));
});