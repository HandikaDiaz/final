function buy(quality, quantity) {
    // 1. Membuat variabel untuk menyimpan harga, potongan, dan total harga
    let price;
    let potongan;
    let total;

    // 2. Menentukan variabel harga barang berdasarkan kualitas barang
    if(quality == "a") {
        price = quantity * 4550
    } else if(quality == "b") {
        price = quantity * 5330
    } else if(quality == "c") {
        price = quantity * 8653
    }

    // 3. Menentukan variabel harga potongan barang berdasarkan kualitas barang
    if(quality == "a") {
        potongan = quantity * 231
    } else if(quality == "b") {
        potongan = quantity * 0.23
    } else if(quality == "c") {
        potongan = "-"
    }

    // 4. Menenttukan variabel total harga barang yang harus dibayar setelah mendapatkan potongan
    if(quality == "a" && quantity > 13) {
        total = quantity * (4550 - 231)
    } else if(quality == "a"){
        total = 4550 * quantity
    } else if(quality == "b" && quantity > 7) {
        total = quantity * (5330 * 0.77)
    } else if(quality == "b") {
        total = 5330 * quantity
    } else if(quality == "c") {
        total = 8653 * quantity
    };

    // 5. Mengembalikan objek yang berisi harga, potongan, dan total harga
    return {price, potongan, total}
};

// 6. Membuat eksekusi fungsi buy
let a = "a"
let b = "b"
let c = "c"
let hasil = buy(a, 14)

// 7. Menampilkan hasil barang
console.log("Total harga barang :", hasil.price);
console.log("Potongan :", hasil.potongan);
console.log("Total yang harus dibayar :", hasil.total);


