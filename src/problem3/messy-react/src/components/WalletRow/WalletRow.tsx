import { BoxProps } from "@mui/material/Box";

interface Props extends BoxProps {
    amount: number;
    usdValue: number;
    formattedAmount: string;
}

const WalletRow: React.FC<Props> = () => {
    return <></>
}

export default WalletRow;