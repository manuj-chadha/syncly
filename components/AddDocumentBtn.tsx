'use client';

import { createDocument } from '@/lib/actions/room.actions';
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const AddDocumentBtn = ({ userId, email, className }: AddDocumentBtnProps) => {
  const router = useRouter();

  const addDocumentHandler = async () => {
    if (email) {
      try {
        const room = await createDocument({ userId, email });
        if (room) router.push(`/documents/${room.id}`);
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Button
      type="button"
      onClick={addDocumentHandler}
      className={`
        flex items-center gap-2 px-6 py-3 rounded-xl
        bg-gradient-to-r from-indigo-800 via-purple-900 to-pink-900
        text-white font-semibold text-sm sm:text-base
        shadow-lg
        transition-all transform hover:scale-105 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-indigo-400
        ${className || ''}
      `}
    >
      <div className="bg-white/20 rounded-full flex items-center justify-center">
        <Image 
          src="/assets/icons/add.svg" 
          alt="add" 
          width={20} 
          height={20} 
          className="invert"
        />
      </div>
      <span className="text-white/90">
        Start a blank document
      </span>
    </Button>
  )
}

export default AddDocumentBtn;
