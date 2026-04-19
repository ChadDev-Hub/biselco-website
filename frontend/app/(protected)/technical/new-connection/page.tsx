
import NewConnectionForm from "./components/NewConnectionForm";

const NewConnectionPage = () => {
    return (

        <div className='container w-fit mt-20 mb-20 h-full mx-2'>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                    <NewConnectionForm />
                </div>

                <div>
                    hello
                </div>
            </div>

        </div>
    )
}

export default NewConnectionPage;