<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'tenant_id';

    protected $fillable = [
        'school_name',
        'address', // Assuming you want to track the tenant's address
    ];
}
