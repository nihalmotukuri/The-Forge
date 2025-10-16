import Link from "next/link";
import { FaGoogle, FaTwitch } from "react-icons/fa";
import { TiArrowRight } from "react-icons/ti"

const page = () => {
    return (
        <main
            className='h-screen flex justify-center items-center'
            style={{
                backgroundImage: `linear-gradient(rgba(56, 31, 31, 0.4), rgba(0,0,0, 0.6)), url('/cyberpunk-bg.jpg')`,
                backgroundSize: 'cover',
                backgroundBlendMode: 'darken'
            }}
        >
            <form
                className='w-[480px] bg-[#181818] flex flex-col justify-center items-center gap-4 p-8 ronded-xl border-b-3 border-[#e3ff04]'
                action=""
            >
                <div className="flex flex-col w-full">

                    <button className="border border-[#e3ff04] text-sm font-semibold px-5 py-4 rounded-xl mt-4 flex justify-center items-center gap-2">
                        <FaGoogle className="text-xl" /> Continue with Google
                    </button>

                    <button className="border border-[#e3ff04] text-sm font-semibold px-5 py-4 rounded-xl mt-4 flex justify-center items-center gap-2">
                        <FaTwitch className="text-xl" /> Continue with Twitch
                    </button>
                </div>

                <div className="w-full flex items-center gap-2 my-2">
                    <div className="border w-full h-0"></div>
                    <span>or</span>
                    <div className="border w-full h-0"></div>
                </div>

                <div className="flex flex-col w-full gap-4">
                    <input
                        className='text-md bg-[#202020] px-8 py-4 border-y border-neutral-700 w-full placeholder-white/28'
                        type="text"
                        placeholder='Name *'
                    />

                    <input
                        className='text-md bg-[#202020] px-8 py-4 border-y border-neutral-700 w-full placeholder-white/28'
                        type="text"
                        placeholder='Email *'
                    />

                    <input
                        className='text-md bg-[#202020] px-8 py-4 border-y border-neutral-700 w-full placeholder-white/28'
                        type="text"
                        placeholder='Password *'
                    />

                    <input
                        className='text-md bg-[#202020] px-8 py-4 border-y border-neutral-700 w-full placeholder-white/28'
                        type="text"
                        placeholder='Confirm Password *'
                    />

                    <div className="flex items-center justify-center gap-2">
                        Already have an account?
                        <Link href={'/login'} className="text-[#00f0ff] flex items-center underline">
                            Sign in <TiArrowRight className="text-xl" />
                        </Link>
                    </div>

                    <button
                        className='bg-[#e3ff04] w-full text-sm text-black font-semibold px-5 py-3 rounded-xl mt-2'
                        type='submit'
                    >
                        REGISTER
                    </button>
                </div>
            </form>
        </main>
    )
}

export default page