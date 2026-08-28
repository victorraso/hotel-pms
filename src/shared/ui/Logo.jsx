export default function Logo({ size = 'big' }) {
  let fontSize = '';
  let marginBottom = '';
  let marginLeft = '';

  if (size === 'big') {
    fontSize = 'text-3xl';
    marginBottom = '-mb-4';
    marginLeft = 'ml-4';
  } else if (size === 'small') {
    fontSize = 'text-base';
    marginBottom = '-mb-3';
    marginLeft = 'ml-2';
  }

  return (
    <div
      className={`font-txt flex flex-col items-center ${fontSize} select-none`}
    >
      <span className={`${marginBottom} ${marginLeft}`}>NEON</span>
      <span>- Dreams -</span>
    </div>
  );
}
