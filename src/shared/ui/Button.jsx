export default function Button({
  children,
  color = 'normal',
  onClick,
  disabled,
  type = 'button',
}) {
  let buttonColor = '';

  if (color === 'normal') {
    buttonColor =
      'border-txt text-txt hover:bg-bg3 hover:shadow-md hover:shadow-bg3';
  } else if (color === 'blue') {
    buttonColor =
      'border-blue-500 text-blue-500 hover:bg-blue-700/20 hover:shadow-md hover:shadow-blue-700/30';
  } else if (color === 'green') {
    buttonColor =
      'border-green-700 text-green-600 hover:bg-green-700/20 hover:shadow-md hover:shadow-green-700/30';
  } else if (color === 'yellow') {
    buttonColor =
      'border-yellow-600 text-yellow-600 hover:bg-yellow-700/20 hover:shadow-md hover:shadow-yellow-700/30';
  } else if (color === 'red') {
    buttonColor =
      'border-red-500 text-red-500 hover:bg-red-700/20 hover:shadow-md hover:shadow-red-700/30';
  } else if (color === 'disabled') {
    buttonColor =
      'border-stone-800 text-stone-800 bg-stone-400/90 hover:bg-stone-400';
  }

  return (
    <button
      className={`rounded-md border px-2 py-1 text-nowrap duration-300 ease-in ${buttonColor} disabled:cursor-not-allowed disabled:border-gray-400 disabled:bg-transparent disabled:text-gray-400 disabled:hover:shadow-md disabled:hover:shadow-gray-700/30`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
