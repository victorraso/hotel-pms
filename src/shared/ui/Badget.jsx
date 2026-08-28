export default function Badget({ title = '', status = 'gray' }) {
  let colors = '';
  let msg = title;

  if (status === 'yellow' || status === 'pending') {
    colors = 'text-yellow-100 bg-yellow-500 border-yellow-300';
  } else if (status === 'green' || status === 'paid') {
    colors = 'text-lime-100 bg-lime-600 border-lime-300';
  } else if (status === 'blue' || status === 'partially_paid') {
    colors = 'text-sky-100 bg-sky-700 border-sky-300';
  } else if (status === 'gray' || status === 'refunded') {
    colors = 'text-stone-100 bg-stone-700 border-stone-300';
  } else if (status === 'red') {
    colors = 'text-red-100 bg-red-700 border-red-300';
  }

  if (!title) {
    msg = status;
  }

  return (
    <div
      className={`flex h-max w-max flex-row items-center justify-center rounded-3xl border px-2 py-px text-xs font-bold ${colors} text-nowrap`}
    >
      <span>{msg.split('_').join(' ')}</span>
    </div>
  );
}
