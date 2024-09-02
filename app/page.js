
import TokenSwap from '@/components/tokenswap';
import TransactionDialog from '@/components/transactionDialog';




export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className='flex flex-col w-[80%] h-[100px] bg-gray-300 rounded-full'>
      <h1 className=' mt-[20px] text-3xl font-bold text-center text-black '>XML to Hungarian Forint</h1>

      </div>
      
    
      <TokenSwap />
      <TransactionDialog />
      

    </main>
  );
}

