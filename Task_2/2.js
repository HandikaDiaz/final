// 1. Daftar angka yang akan diurutkan
let numbers = [20, 12, 35, 11, 17, 9, 58, 23, 69, 21]

// 2. Algoritma Bubble Sort untuk mengurutkan array
for(let check = 0; check < numbers.length - 1; check++) {

    // 3.  Membuat proses pengulangan elemen array yang belum terurut
    for(let news = 0; news < numbers.length - 1 - check; news++) {

        // 4. Membandingkan elemen baru dengan elemen berikutnya
        if(numbers[news] > numbers[news + 1]) {

            // 5. Membuat pengkondisian yang dimana jika elemen saat ini besar, maka tukar posisinya
            let newPosition = numbers[news];
            numbers[news] = numbers[news + 1];
            numbers[news + 1] = newPosition
        };
    };
};

// 6. Menampilkan daftar yang sudah diurutkan
console.log(numbers);
