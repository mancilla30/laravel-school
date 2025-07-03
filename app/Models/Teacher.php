<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $primaryKey = 'teacher_id';

    protected $fillable = [
        'tenant_id',
        'first_name',
        'last_name',
        'subject'
    ];

    protected $casts = [
        'teacher_id' => 'integer',
        'tenant_id' => 'integer',
    ];

    // Relationships
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'teacher_id');
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    // Scopes
    public function scopeForTenant($query, int $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }
}
