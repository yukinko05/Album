import styles from "./styles.module.css";

type Album = {
    title: string,
    createdAt: string,
    coverImg: string
    altText: string
}

export default function Albums() {
    const albums: Album[] = [
        {
            title: "タイトル1",
            createdAt: "2024/06/15",
            coverImg: "data:image/png;base64,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",
            altText: "アルバム画像1"
        },
        {
            title: "タイトル2",
            createdAt: "2024/06/15",
            coverImg: "data:image/png;base64,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",
            altText: "アルバム画像2"
        },
        {
            title: "タイトル3",
            createdAt: "2024/06/15",
            coverImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwFBMVEX///8ATIX61ssASYMAR4IARYEAQ4AAP34AQX8APn4AOnwAPH0AOXv8/P761MgAS4jv9fk0apkANnrl6e/z9PksYZLR2OL++PZBaJgAUIjY4+xwirD29/vs7/VcgqeZsMfH1eF2lbTEzd7X3emltMj73dP96+YmWY+CmLhce6RPe6Nkiayzxda+z91Cb5qMoLq9x9qvvNH98OuInruJpb8aXZFvj681ZZWisclog6lXd6SHm7tIbZ48cJ1Wf6b85NyyI4WEAAAPZElEQVR4nO2deV/qOhOAiVmabopUkFXWcwuILAeRRY/n+3+rNykIXVJoC03v/b19/rnnoqaZZjIzmUxCoZCTk5OTk5OTk5OTk5OTk5OTk/N/gdkZdMfTdXX8slx0iln35uY0J2OsKAQhiBBm/6KrZT3rPt0Q8+3FUBDwAImxGjSz7tltKLbLOgYCoFqbZN25G1B8r1Eoks+RUX/5z0/IOiCh8nFI+T8uYr10Vj4GWmU+GZsty6GYoCfF2iUBAcDj2/c5Os3K+6gMdE3TDArKo492xYr190tyUUAAjOzMjdW1FYqOowARpioov05aURtogctDyNpdpSnEue69qiIjAbFC/0R86+9KBAEBUCrpShLCgIRrGFJQO8KsNMtRhpDZ02X64gQ796JfeO/25XGsX2jj+MKmEiTyUXykl7oF9ddLrbQvNnJoaiXdJzbLwijLB3280LExutyIA4lnoW/AYxQjzzyZfV5ENaKAQH2TJNgP3YjaBfAf80wzdS2qhLJNTceI2jOgnJuLk2i+gr+pF2nCOayi2XgH7YxFjWpouKmRGptOIk8f3jccPhU/opirPVSqMZ1GtYAOZxTsT/SGNJkZDSuGjnKUUDsYQ9vVjkQJo9uHPWgdZk+jKylQZC4vujE65qAOxA2ZMRqS6hBHsaYhA9bEhrAYLWxw0GWuLuIZGo7SvlpCQ2bYFl9CCK6WkMj0FvElBKrQTsSQUK7HTyAhWl8pIZKajNrGtaUMKjIUMSQkXZkSdmNMn7M9jCGhEuJw0iGux+cI51E9cuANVKnbUDE6dkLvXNMQvLCSvjURE2QeRGoaXUK5hibZRISrYHAaXUK505At8RNMRKAHZ1J0CYns3eAIuykBBMNgRdUFWJYsYOE9gZoKFsLFqI41JK5NkWL0TNQRWAs2E/VF6ecSdunwkiCsKQU2pKJKSN6lC1joRNxvcCNYw0YMcFEW29wJom8aNDXRNEFuTPrDW5yE4h78EWglWiaKSt+zcIg/iOgx0EikbKLseOaHt9heX2BMI2WEBdoth/iDiAM2P1JWH2dV3VYvxZUwuAcYZR0me1nh4iNuYEMDg1GPEDnAahbCORQjFYq4UDqBNiI0kZWh4SxiegyBhN+XJ3OWEhbG8WI3gYSzy5qeqYT1eOZUIGGEmq8sCk1OvMfK2AQlNO3L8xDamVYmxloKY++WftN6e4zk8WWXYXh4i7VQJNMJd4nF+tv793S9Av7C7pAX852lhIXvWMYG8VJ8RKhCMIKRh1/q9m8AK/4qKjaiNJ1E2knybjGhmSwQfzDXEkZRy9TYVCQMIgSRi47TIJ5TTAb+k6WEhZUEPVUySLedqEvQU6BmU+l9YJEgtxgXJD2x7yHJZlRc5Gf2PSTZUYwtYpbHn2Iuo5JBgvlWechwGEzEfmYCmmsJSiq/EtpF9IL065BavedBjpJmOYgJNqKSoWazR1OwJClpRge8CnHOFFyNlo2Ej7KUVHK195Fi7C2a5MgvO+Ek2A5OTvjJhhSREXYfySQDzjfjESIqxcf5yE88K+4PbocufxCL7LG1XWPTq9TrTweser/S6WwaU8DFvC6kgxhjus+v8hRrBoNYoQAPw37Y6m+6o/KDplAcW06ICFUNVN52PzfDj5FdI7UyyCLvxryhMj/7G2az1WtvHwx++cyFTPdevXWtVKIP5dFyM281zWMrxWZhoYhKOlLmGwEcKZh66g2GO7uGCaWKolDKtA8jxG/bwfvPmC7WvoaDRa9vhSa5AQQlyZULxRWMudPe6ld6895s9tlg7HY7/p/ZbDFngl3+YzaIskuk6jrADXmPa2K2xJCbzrg8DW/LEAMqNyf1isNKelqDz/YVS9bm5mu9WwQmZF2VHLqZbBrawp/MSgqmRjWpWegTCiFSaUA/RkhUEJAelg7QVvSD5X7RiLRFonbNn/3z0sb3k7kiN+s2UYAikqF/XDMaiTR1cdwpMHyj2LQhLEssXhgSoIuSfI3j7jcUHlu7xPR0q0/ZNxe3WHSyITXKULjufnKVcykJkivuMhTV9waZmlKJO1EGQF+Cj935xST3AzVdEvpziE9EZvjd0QGZCT7vuXajlCSp6nK4hIU1BKq0iTigQBX5e+u07g9xJhfYoXAJWZAh7+z6KwLGk+Bzl5ZR0Rhf5GRLIfA/oBeiOKlQY/5euA5oHwexlCiLax5NlRIUhk+BP98fs8Gk3kq51KZIQvx9wZweHKKWMInb0/d6qggMGVdhtF9Jlh6my7cUI/EODdUXs6GxFSDVE2epe7ZOiUI/BYPkSUEjotdeO0mfcolgRPP8/Pzzz/5su91c4ZrNzqY9b/lb5TiWWi3pfBnNlRlipZwsOLxIl4UXrmn2/OuecffPjZ/y9463+vf0wZMC0K5g9nuLwXBNFC4lVFapbL3xy8hO1Ur/3N853P+65TOe7/bN3t8dx9GswtPxFLM3tFXWD2jcMtApWpXJZNJu1wCsHufJ74OAtxXx+e7EUcQPDJBL/83eTmfjqF68AC8i5uTbVnRVZbMAAHwypa6u3N9OUX+5Wj0q6ob4i057NmEi3iaD064prtznKVX6z71LxIiDeDn2ena3ehzECvP5vnVjc8tiBKMTUYgz1Fcqn9eYqqpKmfbT44P+urty/+z/Q3Ox8cvzZJcuVql73tv978OnlsgPb4no8FhcJoQ7W7U6HPQ6ncoQu8rNfp2XcFbS/b57owD9kpH/65HwR/mfbChYXnyh6/cXJ2wAob79kYrnvY4LhwsSjtjv+gaMBbWBNJ3Z8xr9f4QSFqYI2oF4uKJeXfXeYcEmeugd/59f43J0h3+FM+bIkhmHnvejKgxGRNuS4Zlgv++F722LAArEu9yJXHfQrQkhQO5XN0Ku4x6/z1uaXiBzvKSCxaPC5pI7TnM7i7u7098SUSaj4XUi8fkgXgH5O3MlYX7dC172kacaU3D3a99o+9WjV9l2EJQ8kahLTV0+qKcCxZ+Ec05RXVWGWmceB7tfuW++P4u6cuKTup1nYWkwjceB+5UayCfh6cXdu+K2vnBLb0GvK5tiWuWtZ2HDwsLDE8/7ztzf/S4I4CczlB+X3J8y70V2FSYmrrqq1E3mih58q4m/97zZe7eAhZYn1viBLZuvkdB89ASh/DFMa71T6/ffX3e/wuKZDVsREHvRb/XnW+506JdZWJRYV8FJ3xpEsM/z7LTqVXwbBt6EMzuD51Sj02JmZuT9RNSdM/CoA1Ld0BXMv9fB+dMN9z8KnvVNRmVHoyau2CIYj/xHFEbIO9VjYimAeFXfYubxM04TQ/UnvwQpOPj6hVPOQHS9Zqt8Wa9GWzLzg4tIbfTcLpZvECdKPx9oIf+IWVrcNFPvS1MIIVSrLY8m1NppTn58v/+tRVSK/SlwrNqN+WHUWkN65V1Ewc3e+BKyv9nMZrNN3zOFOiPN2eHnFStRe8iDj/3yXsXl0XI2nEK+0rluj/8b++6VSyKhmOZ8tlvbu2H0rdYnA8DyYZXDiza46QL0ynvNmWJ4w13LuJWECdB4Z95eV4dUDROTku6VqcXmCgLVLVFsS3NL7H0iw6y3X8rIMNTa9P368toJc2iqK1ZqYalFCl6YuzAO/3S+IuU2h9te2GRWTx4j6PElwmLQNC5t5Ylsav8sgnhcujv7+ymyocKLCq/FHPOwRLeXc6vVallMwsyu5WDuPZVaU3PppCaJojHHjQVb0NKYq2mVRHfKmueAelbHV/kKMaVMfuHtmzhVdphHlNfE8lfR19O8XqnZWbx3Pz66YxjIvUgjXQl/qKgSN2N9yJHQEq605SBHwkJZbnmSG25pJEj46t0/lMlckXKAhrldmpbJvsBATslJnWYWmc6onOq2GgQPEh4jYIRAScZzugTo2XjEB3iDrbQIdOTWsZ9olmSdmYXwuBCVCnMWkgraeZo5C2s6JEDrSHlSXcvm1KPNlEdSrDFGQJFvazqq//a39HjTxVXC6bJF8kpM+Y0R0pdQFpL5xTOTK/dDksDsjMxi9jIS7TinCa+xlnmLOf+6R1VqumaHJd+uMMZAat50oQFApeb4WjT8y+NSgH8rRsLTVIkZaBIvADLZvMfSD3S/YGkX/zWrJItLBuu8ojxYaJYCfRtncSvtwDksiO3U36y54dfWyp6EbBnMS5D5dQe1lOfiwmY2DZak3+DS5vVbhFchQzVFz28tHxT2Gkmtk94zxFRYgEGnrcKcFwvoX6lkh5r9mW0QJh9WPuTnZ6e8Oon7X8cIIHV44wRqqzLbAo04M10dd27beBQm6rGCsjniZ1kIHN5qOpr9RWMKdOJUWyCqpHf45xxl6CplXlB+Gw+m1cGVZrXV7y0+qzXiuuLmcZDNzZAT3VNkYw4J1ydES/asd2HGmKbVW2xmjV21aj+4oaWSoSuHi214pRRrMru757+Rr2DAGu6vWodE1eztctOzWq0n88DTU6tlcbmWw9H6QTdUSglCMOxKF0gU1R599io2AiSjm9mLevCbcJ82U8MpwgIQE6pqBNTW1T22DZjgKiWEuG4eYhJCdMD5FGFCqGKg6nBRd6Y4XxDe4rRIAtgCX7RHam2+DNf9WPCE60Mmh6LoWkmrgdrjEf4b2+1stplbzdMKaaMAnM33XCyx+MKB/Y+YzVH4FfroRz5+3Q5x7t8huPb4MhtMOj7fwl+ZKGywmUHLpCjikU2QkLXoDgJ1Un8bvH+Mx9X1nun4u9ttT9469TC7OEbiUqcZSa/04iwg9IIhFurAVez2TBySYK6rGd3tif2130eqKMm6v8PmmzADY5ZhNl+RUAu7nWZDAUpQLxV+Y1Ej9KafdGHTRhNNm76S7IrDVwyo2KBsZF6k4GJA/QX8DkynAEmyrzAWnUlzqEjbTvNSZK5YC6hVq8zzNknCyDV0HSz20KdS09wnlkwd/e92DlhEU0qkUlUUFoD21YwkLKx5ZsjenNz+fMqPwSTMpXxjQMLnYSYX0BaKZZ47IRqpslBr1qjqPNWAUcLOtMO2lJtsZmf1RYjFVwMfwuxDPA31adK+8NvYRGpqbqVeLOSn862fDrCz4bzmjgoWBuLgHoi1JlneyM5oTT5WaskwjJJWnnWuaYl/Myapeqdic8lX1Te9FCIhxWLx+oX4QGd6oDWO4/U035acROW/QMAb8e6YKh3vhsvlcGRr/LAioLVs7Gg6TGrUZ7ko7Wb6fU83p7ikKjlYLoipUbvBiaZ/HZPuig8hwbXvdlanAdKnaIVmAnJycnJycnJycnJycnJycnJycv7l/A9Kvh/+uVeKSgAAAABJRU5ErkJggg==",
            altText: "アルバム画像1"
        },
    ]

    return (
        <div>
            <h1 className={styles.title}>ALBUM</h1>

            <div className={styles.wrap}>
                {albums.map((album) => (
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>{album.title}</h2>
                        <time className={styles.cardDate}>{album.createdAt}</time>
                        <img className={styles.cardImg} src={album.coverImg}
                             alt={album.altText}/>
                    </div>
                ))}
            </div>

        </div>
    )
}