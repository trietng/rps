export function Loading() {
    return (
        <div
            className="fixed z-[2] top-0 left-0 w-full h-full bg-white bg-opacity-50"
        >
            <div
                className="absolute top-1/2 left-1/2 z-[3] w-[100px] h-[50px] ml-[-50px] mt-[-25px] text-center"
            >
                <div className="" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
}
