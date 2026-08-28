export default function ComponentBox({ css, label, content }) {
  return (
    <div className={`${css}`} onClick={(e) => e.stopPropagation()}>
      <h1 className="bg-bg3 border-border3 rounded-t-xl border-b p-5 text-xl font-bold">
        {label}
      </h1>
      <div className="p-5">{content}</div>
    </div>
  );
}
