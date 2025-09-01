<?php
namespace Database\Factories; use Illuminate\Database\Eloquent\Factories\Factory;
class CommentFactory extends Factory { public function definition(): array { return ['body'=>fake()->sentence(12)]; } }
