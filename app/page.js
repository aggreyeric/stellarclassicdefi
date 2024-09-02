
import TokenSwap from '@/components/tokenswap';
import TransactionDialog from '@/components/transactionDialog';
import Link from 'next/link';








export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className='flex flex-col w-[80%] h-[100px] bg-gray-300 rounded-full'>
        <div className='flex flex-row justify-center'>

          <Link href='/' className=' p-4 text-xl text-center text-black '>Swap</Link>
          <Link href='/pool' className='p-4 text-xl text-center text-black '>LiquidityPool</Link>
           
          
        </div>
      <h1 className=' text-3xl font-bold text-center text-black '>XML to Hungarian Forint</h1>

      </div>
      
    
      <TokenSwap />
      <TransactionDialog />
      

    </main>
  );
}

