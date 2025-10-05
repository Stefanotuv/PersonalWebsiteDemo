import { useState, useRef } from "react";

const MenuIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.583 1C0.583 0.586 0.919 0.25 1.333 0.25h13.333c0.415 0 0.75 0.336 0.75 0.75s-0.335 0.75-0.75 0.75H1.333c-0.414 0-0.75-0.336-0.75-0.75zM0.583 11c0-0.414 0.336-0.75 0.75-0.75h13.333c0.415 0 0.75 0.336 0.75 0.75s-0.335 0.75-0.75 0.75H1.333c-0.414 0-0.75-0.336-0.75-0.75zM1.333 5.25c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75h6.667c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75H1.333z"
    />
  </svg>
);
export { MenuIcon };

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.22 7.28a.75.75 0 0 1 1.06 0L12 11.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L13.06 12l4.72 4.72a.75.75 0 1 1-1.06 1.06L12 13.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L10.94 12 6.22 7.28a.75.75 0 0 1 0-1.06z"
    />
  </svg>
);
export { CloseIcon };

const SearchIcon = () => (
  <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.042 9.374c0-3.497 2.835-6.332 6.333-6.332s6.333 2.835 6.333 6.332c0 3.497-2.835 6.332-6.333 6.332-3.498 0-6.333-2.835-6.333-6.332zm6.333-7.832C5.049 1.542 1.542 5.048 1.542 9.374s3.507 7.832 7.833 7.832c1.892 0 3.627-.67 4.981-1.787l2.82 2.82a.75.75 0 1 0 1.06-1.06l-2.82-2.82A7.816 7.816 0 0 0 17.208 9.374c0-4.326-3.507-7.832-7.833-7.832z"
    />
  </svg>
);
export { SearchIcon };