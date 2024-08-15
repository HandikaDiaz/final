function drawImage(numbers) {
    // 1. Mebuat pengkondisian bahwa numbers adalah angka ganjil
    if(numbers % 2 === 0) {
        return;
    };

    // 2. Membuat variabel untuk mencari tengah" baris dan kolom
    const middle = Math.floor(numbers / 2);

    // 3. Membuat proses pengulangan langkah-langkah atau looping setiap baris
    for(let a = 0; a < numbers; a++) {
        let row = '';

        // 4. Membuat proses pengulangan langkah-langkah atau looping setiap kolom
        for(let b = 0; b < numbers; b++) {

            // 5. Membuat pengkondisian untuk mengisi baris dan kolom dengan '*' di setiap pojok kiri kanan atas dan kiri kanan bawah
            if(
                (a === 0 && b === 0) ||
                (a === 0 && b === numbers - 1) ||
                (a === numbers - 1 && b === 0) ||
                (a === numbers - 1 && b === numbers - 1)) {
                    row += '*'
                }

            // 6. Membuat pegkondisian untuk mengisi bagian tengah dari baris dan kolom dengan '#'
            else if(a === middle && b === middle) {
                row += '#'
            }

            // 7.Membuat pengkondisian untuk mengisi baris tengah dan kolom tengah dengan '*'
            else if(a === Math.floor(numbers / 2) || b === Math.floor(numbers / 2)) {
                row += '*'
            }

            // 8. Pengkondisian terakhir diisi dengan '#'
            else {
                row += '#'
            };
        };
        console.log(row);
    };
};

// 9. Eksekusi fungsinya
drawImage(7)