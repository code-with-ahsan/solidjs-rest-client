import { Link, Outlet } from 'solid-app-router';
import { Component, ComponentProps, For } from 'solid-js';
import { restRequests } from '../App';

interface HomeProps extends ComponentProps<any> {
  // add props here
}

const Home: Component<HomeProps> = (props: HomeProps) => {
  return (
    <div>
      <div class="flex gap-4">
        <div class="w-60 bg-gray-200 border-gray-300 border p-4">
          <div class='flex justify-end px-4'>
            <button>+</button>
          </div>
          <div class='list'>
            <For each={restRequests()} fallback={<div>Loading...</div>}>
              {(item) => <div class="p-2 hover:bg-gray-300 cursor-pointer">
                <Link href={`/${item.id}`} class=''>
                  <div>
                    {item.name}
                  </div>
                  <div class="text-xs">
                    {item.request.method} {item.request.url}
                  </div>
                </Link>
              </div>
              }
            </For>
          </div>
        </div>
        <div class="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Home;