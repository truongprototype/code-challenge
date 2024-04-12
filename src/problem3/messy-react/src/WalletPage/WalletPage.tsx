import Box, { BoxProps } from "@mui/material/Box";
import { useMemo } from "react";
import { useWalletBalances } from "../hooks/useWalletBalances";
import { usePrices } from "../hooks/usePrices";
import WalletRow from "../components/WalletRow";

interface WalletBalance {
    currency: string;
    amount: number;
    // declare all needed property for the interfaces.
    blockchain: string;
  }
  interface FormattedWalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
    formatted: string;
  }
  
  interface Props extends BoxProps {
  }
  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices: any = usePrices();
  
      const getPriority = (blockchain: any): number => {
        switch (blockchain) {
          case 'Osmosis':
            return 100
          case 'Ethereum':
            return 50
          case 'Arbitrum':
            return 30
          case 'Zilliqa':
            return 20
          case 'Neo':
            return 20
          default:
            return -99
        }
      }
  
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (balancePriority > -99) {
               if (balance.amount <= 0) {
                 return true;
               }
            }
            return false
          }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
              const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
              return -1;
            } else if (rightPriority > leftPriority) {
              return 1;
            }
            // We should return 0 if they are equal, otherwise it return undefined.
            return 0; 
      });
    }, [balances]); // We didn't use "prices" in this Memo, so I deleted it.
  
    // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    //   return {
    //     ...balance,
    //     formatted: balance.amount.toFixed()
    //   }
    // })
  
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
        //   className={classes.row} This approach was discontinued, instead we should use styled or sx prop.
        //   key={index} Using key with index can negatively impact performance and may cause issues with component state.
        //   We should use an unique property instead
          key={balance.blockchain}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    })
  
    // Return Box component instead of div because "rest" props extends the BoxProps 
    return (
      <Box {...rest}>
        <p>Nice to cooperate with you.</p>
        {rows}
      </Box>
    )
  }

  export default WalletPage;