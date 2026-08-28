export default function InfoBox({ title = '', data = null }) {
  const isObjectOrArray = typeof data === 'object' && data !== null;

  return (
    <div className="border-border3 flex flex-col rounded-md border">
      <h2 className="bg-bg3 rounded-t-md px-4 py-1 font-bold">{title}</h2>
      <div className="flex flex-col px-4 py-1 text-sm">
        {isObjectOrArray ? (
          Object.entries(data).map(([k, v]) => (
            <span
              key={k}
              className="grid grid-cols-[1fr_1fr] gap-3 wrap-anywhere"
            >
              <h3 className="font-bold">{k}:</h3>
              <p className="flex flex-row gap-3">{v}</p>
            </span>
          ))
        ) : (
          <div className="wrap-anywhere">{data}</div>
        )}
      </div>
    </div>
  );
}
