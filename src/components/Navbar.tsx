import { Link } from 'solid-app-router';
import { Component } from 'solid-js';

const Navbar: Component = () => {
  return (
    <div class="bg-white py-2 px-4 h-16 flex items-center justify-between">
      <div class="hero">REST in Peace</div>
      <div class="flex items-center gap-4">
        <Link class="hover:opacity-50" href='/'>Home</Link>
        <Link class="hover:opacity-50" href='/about'>About</Link>
      </div>
    </div>
  )
}

export default Navbar;