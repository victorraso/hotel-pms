import Spinner from './Spinner';

export default function Table({
  header,
  css,
  colGrid,
  bodyData,
  bodyRender,
  isLoading,
}) {
  return (
    <div
      style={{ '--col-grid': colGrid }}
      className={`border-border3 relative h-full w-full overflow-y-auto rounded-xl border ${css}`}
    >
      {!isLoading && (
        <div className="bg-bg3 sticky top-0 grid grid-cols-(--col-grid) items-center gap-5 rounded-t-xl px-4 py-3 font-bold uppercase">
          {header}
        </div>
      )}
      {isLoading ? (
        <div className="flex h-30 w-full flex-col items-center justify-center px-30">
          <Spinner />
          <span className="mt-2 font-bold">Loading data...</span>
        </div>
      ) : (
        <div className="bg-bg2 rounded-b-xl">{bodyData.map(bodyRender)}</div>
      )}
    </div>
  );
}
