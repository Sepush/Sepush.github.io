import React, { useState } from 'react'

interface Props {
  message: string
}

export function Counter({ message }: Props) {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div i-tabler:brand-react bg-blue-500 px-4 py-2 />
      <p>{message}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Count:
        {' '}
        {count}
      </button>
    </div>
  )
};
