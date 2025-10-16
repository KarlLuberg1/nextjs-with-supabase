export default async function ServerSide() {
  const res = await fetch(
    "https://official-joke-api.appspot.com/jokes/random",
    {
      cache: "no-store",
    }
  );

  const joke = await res.json();

  return (
    <div>
      <h1>Joke API</h1>
      <div
        style={{
          border: "1px solid #ffffffff",
          background: "#242424ff",
        }}
      >
        <p>
          <h2>{joke.setup}</h2>
        </p>
        <p>{joke.punchline}</p>
      </div>
    </div>
  );
}
