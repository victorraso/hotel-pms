import useTheme from '../../app/providers/theme-provider/useTheme';

const moon =
  'M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z';

const sun =
  'M480-28 346-160H160v-186L28-480l132-134v-186h186l134-132 134 132h186v186l132 134-132 134v186H614L480-28Zm141.5-310.5Q680-397 680-480t-58.5-141.5Q563-680 480-680t-141.5 58.5Q280-563 280-480t58.5 141.5Q397-280 480-280t141.5-58.5ZM395-395q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35Zm85 255 100-100h140v-140l100-100-100-100v-140H580L480-820 380-720H240v140L140-480l100 100v140h140l100 100Zm0-340Z';

export default function ThemeIcon() {
  const { state, dispatch } = useTheme();
  return (
    <button
      className="cursor-pointer"
      onClick={() =>
        dispatch({
          type: 'theme/change',
          payload: state.theme === 'light' ? 'dark' : 'light',
        })
      }
    >
      <svg
        className="w-5 fill-(--color-txt2)"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
      >
        <path
          d={moon}
          className={`transition-opacity duration-500 ${
            state.theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <path
          d={sun}
          className={`transition-opacity duration-500 ${
            state.theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </svg>
    </button>
  );
}
