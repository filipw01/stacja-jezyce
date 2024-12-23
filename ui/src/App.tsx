import type { Component } from "solid-js";
import styles from "./App.module.css";
import { createSignal, For, Show } from "solid-js";

type ApartmentData = {
  name: string;
  rooms: number;
  price: number;
  level: number;
  measurement: number;
  estate3D: string;
  planLink: string;
  graphLink: string;
  slug: string;
  building: string;
  delivery: string;
  type: string;
  balcony: number;
  terrace: number;
  garden: number;
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
  hasSeperateKitchen: boolean;
  smartHouse: boolean;
  hasGastronomy: boolean;
  __typename: "MieszkanieRaw";
};

const apartmentsAvailability = (apartmentsPerDay: [string, any]) => {
  const availability = [];

  let availableOnPreviousDay = [];

  for (const [date, apartments] of apartmentsPerDay) {
    const soldOutApartments = [];
    const availableAgainApartments = [];

    for (const previousDayApartment of availableOnPreviousDay) {
      if (!apartments.some((el) => el.name === previousDayApartment.name)) {
        soldOutApartments.push(previousDayApartment);
      }
    }

    for (const apartment of apartments) {
      if (!availableOnPreviousDay.some((el) => el.name === apartment.name)) {
        availableAgainApartments.push(apartment);
      }
    }

    availableOnPreviousDay = apartments;
    availability.push([
      date,
      { soldOut: soldOutApartments, availableAgain: availableAgainApartments },
    ]);
  }
  return availability;
};

const App: Component = () => {
  const [view, setView] = createSignal<"soldOut" | "available">("soldOut");
  const modules = import.meta.glob("../../data/*.json", { eager: true });
  const sortedModules = Object.entries(modules)
    .sort(([a], [b]) => {
      return a.localeCompare(b);
    })
    .map(([key, value]) => [
      key.replace("../../data/", "").replace(".json", ""),
      value.default,
    ]);

  const availability = apartmentsAvailability(sortedModules);
  const available = sortedModules.at(-1)[1];

  return (
    <div class={styles.App}>
      <button onClick={() => setView("soldOut")}>Sold Out</button>
      <button onClick={() => setView("available")}>Available</button>
      <div>
        <Show when={view() === "soldOut"}>
          <h1>Sold Out</h1>
          <ul>
            <For
              each={availability
                .slice(1)
                .filter(
                  (el) =>
                    el[1].soldOut.length > 0 || el[1].availableAgain.length > 0,
                )}
            >
              {(item) => {
                return (
                  <li>
                    <h2>{item[0]}</h2>
                    <ul class={styles.apartmentsContainer}>
                      <For each={item[1].availableAgain}>
                        {(item) => <Apartment borderColor="#0f0" {...item} />}
                      </For>
                      <For each={item[1].soldOut}>
                        {(item) => <Apartment borderColor="#f00" {...item} />}
                      </For>
                    </ul>
                  </li>
                );
              }}
            </For>
          </ul>
        </Show>
        <Show when={view() === "available"}>
          <h1>Available</h1>
          <ul class={styles.apartmentsContainer}>
            <For each={available}>
              {(item) => <Apartment borderColor="#000" {...item} />}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
};

const Apartment: Component<ApartmentData & { borderColor: string }> = (
  props,
) => {
  const moneyFormatter = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  });
  const [isImageOpen, setIsImageOpen] = createSignal(false);
  return (
    <li
      class={styles.apartmentCard}
      style={{ border: `1px solid ${props.borderColor}` }}
    >
      <img
        onClick={() => setIsImageOpen((prev) => !prev)}
        style={{
          position: isImageOpen() ? "fixed" : "static",
          top: isImageOpen() ? "0" : "auto",
          left: isImageOpen() ? "0" : "auto",
          bottom: isImageOpen() ? "0" : "auto",
          right: isImageOpen() ? "0" : "auto",
          width: isImageOpen() ? "100%" : undefined,
          height: isImageOpen() ? "100%" : undefined,
          background: "white",
          "object-fit": isImageOpen() ? "contain" : "cover",
        }}
        class={styles.apartmentImage}
        loading="lazy"
        height="100"
        alt=""
        src={`https://poznan.robyg.pl/_next/image?url=${props.planLink}&w=1200&q=75`}
      />
      <div class={styles.apartmentText}>
        {props.name}
        <div>
          <div>{props.measurement}m²</div>
          <div>{moneyFormatter.format(props.price)}</div>
        </div>
      </div>
    </li>
  );
};

export default App;
