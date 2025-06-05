import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 7 8"
        fill="none"
        {...props}
    >
        <path
            fill="currentColor"
            d="M.147.919A.501.501 0 0 1 .775.854L.854.92l2.373 2.373L5.6.919 5.68.854a.5.5 0 0 1 .692.694l-.064.078-2.374 2.373 2.374 2.374.064.08a.5.5 0 0 1-.692.692L5.6 7.08 3.228 4.706.854 7.08a.5.5 0 1 1-.707-.707L2.52 3.999.147 1.626l-.065-.078a.501.501 0 0 1 .065-.63Z"
        />
    </svg>
)
export { SvgComponent as CloseIcon }
