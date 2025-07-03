<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->increments('enrollment_id');

            $table->integer('tenant_id');
            $table->integer('student_id');
            $table->integer('course_id');

            // curdate() es una función de MySQL que devuelve la fecha actual
            $table->date('enrollment_date')->default(DB::raw('curdate()'));
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
