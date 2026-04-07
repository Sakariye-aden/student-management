import LoginForm from "../../components/Auth/LoginForm"


const LoginPage = () => {
   return (
     <div className='h-screen flex flex-col justify-center items-center bg-background'>
      <div className='absolute inset-0 bg-linear-to-br from-secondary to-secondary opacity-1' />
      <div className='z-5 w-full max-w-md px-4'>
         <div className='mb-6 text-center'>
            <h1 className='text-3xl font-bold text-foreground'>Welcome back</h1>
            <p>we're glad to see you again</p>
         </div>
         {/* {registrartion form} */}
          <LoginForm/>
      </div>
    </div> 
  )
}

export default LoginPage