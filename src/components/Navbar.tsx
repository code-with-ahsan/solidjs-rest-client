import { Link } from 'solid-app-router';
import { Component } from 'solid-js';

const Navbar: Component = () => {
  return (
    <div class="bg-purple-600 text-white py-2 px-8 h-16 flex items-center justify-between">
      <Link class="hover:opacity-50 hero" href='/'>REST in Peace</Link>
      <div class="flex items-center gap-4">
        <Link class="hover:opacity-50" href='/about'>About</Link>
      </div>
    </div>
  )
}

export default Navbar;