/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

function Footer() {
  return (
      <footer css={css`
        width: 100%;
        height: 60px;
        background-color: var(--primary-s-color);
      `}>
        <div css={css`
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--primary-color);
          font-size: 14px;
          line-height: 1;
        `}>
          &copy;Kedama 2023
        </div>
      </footer>
  );
}

export default Footer;
