//@ts-check
console.log("test");
(function () {
    console.log("load script");
    document.getElementById("run-button")?.addEventListener("click", () => {
        // const app = document.getElementById("app");
        const app = document.getElementById("sample-textarea");

        app.value = "Hello World!";
    });
}());