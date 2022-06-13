import { Link, Outlet } from 'solid-app-router';
import { Component, ComponentProps, createSignal, For } from 'solid-js';
import RequestModal from '../components/RequestModal';
import { restRequests } from "../store";

interface HomeProps extends ComponentProps<any> {
  // add props here
}

const Home: Component<HomeProps> = (props: HomeProps) => {
  const [showModal, setShowModal] = createSignal(false);

  return (
    <div>
      <RequestModal show={showModal()} onModalHide={() => setShowModal(!showModal())} />
      <div class="flex gap-4">
        <div class="w-1/4 bg-gray-200 border-gray-300 border p-4">
          <div class="flex justify-end px-4">
            <button onclick={() => setShowModal(true)}>+</button>
          </div>
          <div class="list">
            <For each={restRequests()} fallback={<div>Loading...</div>}>
              {(item) => (
                <div class="p-2 hover:bg-gray-300 cursor-pointer">
                  <Link href={`/${item.id}`} class="">
                    <div>{item.name}</div>
                    <div class="text-xs break-all">
                      {item.request.method} {item.request.url}
                    </div>
                  </Link>
                </div>
              )}
            </For>
          </div>
        </div>
        <div class="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;