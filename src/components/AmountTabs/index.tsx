import React, { useState } from 'react';
import { TEXT } from '../../theme';
import Gs from 'theme/globalStyles'; // Import Gs from globalStyles

interface Props {
  onChange: (value: number) => void;
}

export default function AmountTabs({ onChange }: Props) {
  const [current, setCurrent] = useState(25);

  const onClick = (value: number) => {
    onChange(value);
    setCurrent(value);
  };

  return (
    <Gs.Percent>
      {' '}
      {[25, 50, 75, 100].map((value) => (
        <a key={value} className={current === value ? 'active' : ''} onClick={() => onClick(value)}>
          <TEXT.default fontWeight={600} fontSize={16}>
            {value}%
          </TEXT.default>
        </a>
      ))}
    </Gs.Percent>
  );
}
