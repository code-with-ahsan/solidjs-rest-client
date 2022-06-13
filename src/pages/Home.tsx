import { Link, Outlet, useLocation, useNavigate } from "solid-app-router";
import { Component, createSignal, For } from "solid-js";
import RequestModal from "../components/RequestModal";
import { restRequests, setRestRequests } from "../store";
import "./Home.css";


const Home: Component = () => {
  const [showModal, setShowModal] = createSignal(false);
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div>
      <RequestModal
        show={showModal()}
        onModalHide={(id: string | null) => {
          setShowModal(!showModal());
          if (id) {
            navigate(`/${id}`);
          }
        }}
      />
      <div class="flex gap-4">
        <div class="w-1/4 bg-gray-200 border-gray-300 border p-4 rounded-lg">
          <div class="flex justify-between py-4">
            <h1 class="text-sm ">Rest Requests</h1>
            <button
              onclick={() => setShowModal(true)}
              role="button"
              class="w-6 h-6 flex transition-all ease-in-out duration-100 hover:scale-125 items-center justify-center text-white bg-purple-600 border border-purple-600 rounded-full hover:bg-purple-700 active:text-white focus:outline-none focus:ring"
            >
              <span class="sr-only"> Add Request </span>
              <ion-icon name="add"></ion-icon>
            </button>
          </div>
          <div class="list">
            <For each={restRequests()} fallback={<div>Loading...</div>}>
              {(item) => (
                <Link href={`/${item.id}`} class="relative list__item">
                  <div class="p-2 hover:bg-gray-300 cursor-pointer pr-12 rounded-lg mb-2" classList={{ 'list__item--active': Boolean(location.pathname === `/${item.id}`) }}>
                    <div>{item.name}</div>
                    <div class="text-xs break-all">
                      {item.request.method} {item.request.url}
                    </div>
                  </div>
                  <ion-icon
                    onclick={(e: MouseEvent) => {
                      e.preventDefault();
                      e.stopImmediatePropagation();
                      if (restRequests()?.length) {
                        const requests = restRequests() || [];
                        setRestRequests(
                          requests.filter((i) => i.id !== item.id)
                        );
                        if (location.pathname === `/${item.id}`) {
                          navigate("/");
                        }
                      }
                    }}
                    class="absolute text-xl hover:scale-125 transition-all ease-in-out duration-100 hover:text-red-700 text-red-600 right-2 top-0 bottom-0 m-auto"
                    name="trash"
                  ></ion-icon>
                </Link>
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
