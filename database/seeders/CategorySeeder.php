<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    private const SUPPORTED_TYPES = ['income', 'expense'];

    public function run(): void
    {
        $defaults = config('categories.defaults', []);

        if (empty($defaults)) {
            $this->command?->warn('No default categories configured. Skipping category seeding.');

            return;
        }

        foreach ($defaults as $type => $names) {
            if (! in_array($type, self::SUPPORTED_TYPES, true)) {
                $this->command?->warn("Unsupported category type '{$type}' detected. Skipping.");

                continue;
            }

            foreach ((array) $names as $name) {
                if (! is_string($name) || $name === '') {
                    continue;
                }

                Category::updateOrCreate(
                    [
                        'name' => $name,
                        'user_id' => null,
                    ],
                    [
                        'type' => $type,
                    ],
                );
            }
        }
    }
}