import React, { useEffect, useRef } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { TEXT } from '../../theme';
import { AutoColumn } from '../../components/Column';
import {
  CommonHeaderWrapper,
  CommonPageBody,
  CommonPageWrapper,
  Li,
  Ul,
} from '../../components/service-agreement/common';

export default function PrivacyPolicy() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current?.scrollIntoView();
    }
  }, []);

  return (
    <CommonPageWrapper>
      <CommonHeaderWrapper ref={ref}>
        <Header showBottom={true} />
      </CommonHeaderWrapper>
      <CommonPageBody>
        <AutoColumn gap="40px">
          <TEXT.primary fontSize={32} fontWeight={600}>
            Privacy policy
          </TEXT.primary>
          <AutoColumn gap="xl">
            <TEXT.primary fontSize={18} fontWeight={600} lineHeight="28.8px">
              Lorem Ipsum
            </TEXT.primary>
            <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
              enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non deserunt ullamco
              est sit aliqua dolor do amet sint.
            </TEXT.secondary>
            <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
              Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim
              mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit
              mollit.Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit
              aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            </TEXT.secondary>
            <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
              Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua
              dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt
              nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
              consequat duis enim velit mollit.Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non
              deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
              Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua
              dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt
              nostrud amet.
            </TEXT.secondary>
          </AutoColumn>

          <div>
            <TEXT.primary fontSize={18} fontWeight={600} lineHeight="28.8px">
              Lorem Ipsum
            </TEXT.primary>
            <Ul>
              <AutoColumn gap="xl">
                <Li>
                  <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat
                    duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non
                    deserunt ullamco est sit aliqua dolor do amet sint.
                  </TEXT.secondary>
                </Li>
                <Li>
                  <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
                    Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet
                    minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
                    enim velit mollit.Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt
                    ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                  </TEXT.secondary>
                </Li>
                <Li>
                  <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
                    Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit
                    aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam
                    consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
                    sint. Velit officia consequat duis enim velit mollit.Exercitation veniam consequat sunt nostrud
                    amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
                    consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim mollit
                    non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit
                    mollit. Exercitation veniam consequat sunt nostrud amet.
                  </TEXT.secondary>
                </Li>
                <Li>
                  <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
                    Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit
                    aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam
                    consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
                    sint. Velit officia consequat duis enim velit mollit.Exercitation veniam consequat sunt nostrud
                    amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
                    consequat duis enim velit mollit.
                  </TEXT.secondary>
                </Li>
              </AutoColumn>
            </Ul>
          </div>

          <div>
            <TEXT.primary fontSize={18} fontWeight={600} lineHeight="28.8px">
              Lorem Ipsum
            </TEXT.primary>
            <Ul>
              <AutoColumn gap="xl">
                <Li>
                  <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat
                    duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet. Amet minim mollit non
                    deserunt ullamco est sit aliqua dolor do amet sint.
                  </TEXT.secondary>
                </Li>
                <Li>
                  <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
                    Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet
                    minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
                    enim velit mollit.Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt
                    ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
                  </TEXT.secondary>
                </Li>
                <Li>
                  <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
                    Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit
                    aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam
                    consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
                    sint. Velit officia consequat duis enim velit mollit.Exercitation veniam consequat sunt nostrud
                    amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
                    consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim mollit
                    non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit
                    mollit. Exercitation veniam consequat sunt nostrud amet.
                  </TEXT.secondary>
                </Li>
              </AutoColumn>
            </Ul>
            <TEXT.secondary fontSize={14} fontWeight={500} lineHeight="24px">
              Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua
              dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt
              nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
              consequat duis enim velit mollit.Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non
              deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
            </TEXT.secondary>
          </div>
        </AutoColumn>
      </CommonPageBody>
      <Footer />
    </CommonPageWrapper>
  );
}
