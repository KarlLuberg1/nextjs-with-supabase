"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import {
  createCarServer,
  deleteCarServer,
  updateCarServer,
} from "./serverside";

interface Car {
  id: number;
  make: string;
  model: string;
}

export default function Page() {
  const [Cars, setCars] = useState<Car[] | null>(null);

  const supabase = createClient();
  const [make, setmake] = useState("");
  const [model, setmodel] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("Cars").select();
      setCars(data);
    };
    getData();
  }, [supabase]);

  const addCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await createCarServer(make, model);
    setCars((prev) => [...(prev ?? []), ...(data ?? [])]);
    setmake("");
    setmodel("");
    setmodel("");
  };

  const updateCar = async (
    id: number,
    newmake: string,
    newmodel: string
  ) => {
    const data = await updateCarServer(id, newmake, newmodel);
    if (data?.length) {
      setCars((prev) => prev?.map((t) => (t.id === id ? data[0] : t)) ?? null);
    }
  };

  const deleteCar = async (id: number) => {
    await deleteCarServer(id);
    setCars((prev) => prev?.filter((Car) => Car.id !== id) ?? null);
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Cars</h1>
      <form onSubmit={addCar} className="flex flex-col gap-3 mb-8">
        <input
          value={make}
          onChange={(e) => setmake(e.target.value)}
          placeholder="make"
          className="p-2 border rounded"
          required
        />
        <textarea
          value={model}
          onChange={(e) => setmodel(e.target.value)}
          placeholder="model"
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Add Car
        </button>
      </form>
      <div className="space-y-4">
        {Cars?.map((Car) => (
          <div
            key={Car.id}
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <h2 className="font-semibold">{Car.make}</h2>
              <p className="text-gray-700">{Car.model}</p>
            </div>
            <button
              onClick={() => deleteCar(Car.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
            <button
              onClick={async () => {
                const newmake = prompt("Enter new make:", Car.make);
                const newmodel = prompt(
                  "Enter new model:",
                  Car.model
                );
                if (newmake !== null && newmodel !== null)
                  await updateCar(Car.id, newmake, newmodel);
              }}
              className="text-blue-600"
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
