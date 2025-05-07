#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAXN 16
#define MAXNUM 256

int a[MAXN];
int BIT[MAXN + 1];
int n = 0;

int input_converter(char *s, int *a, int maxSize)
{
    memset(a, 0, sizeof(int) * maxSize);
    int m = 0;

    int i = 0, temp = 0;

    if (s[0] == '\n')
        return 0;
    s[strcspn(s, "\n")] = '\0';

    while (s[i] != '\0')
    {
        if (m >= maxSize)
        {
            printf("!! Please enter at most %d number !!\n", maxSize);
            return -1;
        }

        if (isdigit(s[i]))
        {
            temp = temp * 10 + (s[i] - '0');
            if (temp > MAXNUM)
            {
                printf("!! Please enter the number inside the range !!\n");
                return -1;
            }
        }
        else if (s[i] == ',')
        {
            if (i == 0 || s[i - 1] == ',')
            {
                printf("!! Please enter the number separated by ',' !!\n");
                return -1;
            }
            a[m++] = temp;
            temp = 0;
        }
        else
        {
            if (s[i] == '-' && isdigit(s[i + 1]))
                printf("!! Please enter the number inside the range !!\n");
            else
                printf("!! Please enter only numbers !!\n");
            return -1;
        }

        i++;
    }
    if (s[i - 1] == ',')
    {
        printf("!! Please enter the number separated by ',' !!\n");
        return -1;
    }
    else
        a[m++] = temp;

    return m;
}

void printAll(int n)
{
    printf("The orig array:\n");
    for (int i = 0; i < n; i++)
        printf("%d ", a[i]);
    printf("\n");

    printf("The BIT tree:\n");
    for (int i = 1; i <= n; i++)
        printf("%d ", BIT[i]);
    printf("\n");
}

void enqueue(int i, int x, int **changes, int *back)
{
    changes[*back][0] = i;
    changes[*back][1] = x;
    (*back)++;
}

int lowbit(int x)
{
    return x & (-x);
}

void BIT_add(int i, int delta, int *BIT, int **changes, int *back)
{
    while (i <= MAXN)
    {
        BIT[i] += delta;
        enqueue(i, BIT[i], changes, back);
        i += lowbit(i);
    }
}

int BIT_sum(int i, int **changes, int *back, int state)
{
    int sum = 0;
    while (i > 0)
    {
        sum += BIT[i];
        enqueue(i, state * BIT[i], changes, back);
        i -= lowbit(i);
    }
    return sum;
}

int **construct(char *s)
{
    n = input_converter(s, a, MAXN);

    if (n <= 0)
        return NULL;

    memset(BIT, 0, sizeof(int) * (n + 1));

    int **changes = malloc(64 * sizeof(int *));
    for (int i = 0; i < 64; i++)
    {
        changes[i] = malloc(2 * sizeof(int));
        changes[i][0] = changes[i][1] = 0;
    }

    int back = 0;

    for (int i = 0; i < n; i++)
        BIT_add(i + 1, a[i], BIT, changes, &back);

    return changes;
}

int **query(char *s)
{
    if (n <= 0)
    {
        printf("!! Please construct the array first !!\n");
        return NULL;
    }
    int op[2];

    if (input_converter(s, op, 2) <= 0)
        return NULL;

    int l = op[0], r = op[1];

    if (l < 1 || l > n || r < 1 || r > n)
    {
        printf("!! Please enter the number inside the range !!\n");
        return NULL;
    }

    if (l > r)
    {
        l = l + r;
        r = l - r;
        l = l - r;
    }

    int **changes = malloc(64 * sizeof(int *));
    for (int i = 0; i < 64; i++)
    {
        changes[i] = malloc(2 * sizeof(int));
        changes[i][0] = changes[i][1] = 0;
    }
    int back = 0;

    BIT_sum(r, changes, &back, 1);
    BIT_sum(l - 1, changes, &back, -1);
    return changes;
}

int **update(char *s)
{
    if (n <= 0)
    {
        printf("!! Please construct the array first !!\n");
        return NULL;
    }
    int op[2];

    if (input_converter(s, op, 2) <= 0)
        return NULL;

    int i = op[0], x = op[1];

    if (i < 1 || i > n || x < 0 || x > MAXNUM)
    {
        printf("!! Please enter the number inside the range !!\n");
        return NULL;
    }

    int **changes = malloc(64 * sizeof(int *));
    for (int j = 0; j < 64; j++)
    {
        changes[j] = malloc(2 * sizeof(int));
        changes[j][0] = changes[j][1] = 0;
    }
    int back = 0;

    int delta = x - a[i - 1];
    a[i - 1] = x;
    BIT_add(i, delta, BIT, changes, &back);

    return changes;
}

int get_N()
{
    return n;
}

int main(void)
{
    while (1)
    {
        int i = 0;
        char input[4 * MAXN];
        printf("\nOperations:\n");
        printf("-1 - Exit\n");
        printf(" 0 - Construct array\n");
        printf(" 1 - Query range sum (l r)\n");
        printf(" 2 - Update index (i x)\n");
        printf(" 3 - Print current array and BIT\n\n");

        int op;
        scanf("%d", &op);
        switch (op)
        {
        case -1:
            return 0;
        case 0:
        {
            n = -1;
            while (getchar() != '\n')
                ;
            printf("Enter the number in the range 0~256 seperated by ',' with length under 16, -1 to return: ");
            fgets(input, sizeof(input), stdin);
            construct(input);
            break;
        }
        case 1:
        {
            printf("Enter the index (l, r) in the range 1~%d, -1 to return: ", n);
            while (getchar() != '\n')
                ;
            fgets(input, sizeof(input), stdin);
            int **changes = query(input);
            while (changes && changes[i][0] > 0)
            {
                printf("%d %d\n", changes[i][0], changes[i][1]);
                i++;
            }
            break;
        }
        case 2:
        {
            printf("Enter the index i in the range 1~%d, target x in range 0~256, -1 to return: ", n);
            while (getchar() != '\n')
                ;
            fgets(input, sizeof(input), stdin);
            int **changes = update(input);
            while (changes && changes[i][0] > 0)
            {
                printf("%d %d\n", changes[i][0], changes[i][1]);
                i++;
            }
            break;
        }
        case 3:
            printAll(n);
            break;
        default:
            printf("Please enter operation among {-1,0,1,2,3}\n");
            break;
        }
    }

    return 0;
}
