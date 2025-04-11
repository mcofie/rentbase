<template>
  <main class="my-10 xl:w-4/5 lg:w-3/4 w-5/6 mx-auto">
    <div class="buttons flex flex-row space-x-1 pb-5 justify-center">
      <div>
        <h3>RentBase</h3>
      </div>

    </div>

    <div class="jumbo py-5 text-center flex flex-col xl:w-2/3 lg:w-3/5 md:w-4/5 lg:py-10  mx-auto items-center">
      <h2 class="my-2.5 xl:text-7xl lg:text-5xl md:text-5xl text-4xl font-bold">How about, we help you <span
          class="underline underline-offset-4 text-blue-700">pay</span> your <span
          class="underline underline-offset-4 text-blue-700 animate-bounce">rent</span> month on month?</h2>
      <UButton class="w-fit  bg-linear-to-r/hsl from-indigo-500 to-blue-400" size="xl" style="cursor: pointer">Get
        Started Now!
      </UButton>
    </div>

    <div
        v-if="state.showCalculator"
        class="calculator border-blue-200 border-1 bg-blue-50 rounded-3xl w-full xl:w-2/3 md:w-4/5 lg:w-2/3 mx-auto my-10">
      <div class="flex flex-col items-center justify-center px-5 py-10">
        <h2 class="my-3 px-5 text-2xl">Let us in on your finances!</h2>

        <div class="w-full flex flex-col items-center justify-center p-5">
          <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <div class="flex flex-col space-y-5 lg:flex-row md:flex-row  space-x-4">
              <UFormField label="Net monthly salary" name="netMonthlySalary">
                <UInputNumber v-model="state.netMonthlySalary"
                              orientation="vertical"
                              description="We'll never share your email with anyone else."
                              hint="Optional"
                              help="Please enter a valid email address."
                              size="xl"/>
              </UFormField>
              <UFormField label="Rent amount per month" name="rentAmountPerMonth">
                <UInputNumber v-model="state.rentAmountPerMonth"
                              orientation="vertical"
                              description="We'll never share your email with anyone else."
                              hint="Optional"
                              help="Please enter a valid email address."
                              size="xl"/>
              </UFormField>
            </div>

            <div class="flex flex-row ">
              <div class="flex  flex-col space-y-5 lg:flex-row md:flex-row  space-x-4">
                <UFormField label="Number of years renting" name="rentDurationPerMonth">
                  <UInputNumber v-model="state.rentDurationPerMonth"
                                orientation="vertical"
                                description="We'll never share your email with anyone else."
                                hint="Optional"
                                help="Please enter a valid email address."
                                size="xl"/>
                </UFormField>
                <UFormField label="Employment status" name="employmentType">
                  <USelect v-model="value" :items="items" size="xl" class="w-48"/>
                </UFormField>
              </div>
            </div>
            <UButton size="xl" type="submit" class="bg-linear-to-r/hsl from-indigo-500 to-blue-400">
              Calculate
            </UButton>
          </UForm>

        </div>
      </div>
    </div>

    <div
        v-else
        class="calculator w-full xl:w-2/3 md:w-4/5 lg:w-2/3 mx-auto border-gray-200  border-1 p-5 xl:p-15 rounded-3xl my-5">
      <div class="flex flex-row w-full mx-auto">

        <div class="justify-center items-center flex flex-col w-full">

          <div v-if="state.expectedMonthlyRent.isElligible">
            <p class="text-gray-500 text-sm text-center p-3">
              To use a font in your Nuxt UI application, you can simply declare it in your CSS. It will be automatically
              loaded and optimized for you.
            </p>
            <div
                class="shadow-md w-full mt-5 bg-linear-to-r from-blue-600 to-gray-700 text-white border-1 rounded-2xl xl:my-5 xl:p-5 flex flex-col p-5">
              <h2 class="xl:text-5xl lg:text-5xl md:text-5xl text-4xl font-bold">
                {{ formatMoney(state.expectedMonthlyRent.totalRepayment) }}</h2>
              <small class="text-blue-300 text-md">Expected monthly rent payment</small>

              <div class="flex xl:flex-row lg:flex-row flex-col justify-between mt-8">
                <p>Refundable Security Deposit:</p>
                <h4 class="font-bold">{{ formatMoney(state.expectedMonthlyRent.refundableDeposit) }}</h4>
              </div>

              <div class="flex xl:flex-row lg:flex-row flex-col justify-between mt-3">
                <p>Amount due before Move-in</p>
                <h4 class="font-bold">{{ formatMoney(state.expectedMonthlyRent.amountDueBeforeMoveIn) }}</h4>
              </div>
            </div>
            <div class="flex xl:flex-row lg:flex-row md:flex-row flex-col my-5 space-x-5 space-y-5 w-2/3">
              <UButton @click="state.showCalculator = true" size="xl"
                       class="hidden bg-linear-to-r/hsl from-indigo-500 to-blue-400">Calculate Again
              </UButton>
              <UButton class="bg-linear-to-r/hsl from-indigo-500 to-blue-400" size="xl" to="https://github.com/nuxt/ui"
                       target="_blank">Apply Now!
              </UButton>
            </div>

          </div>
          <div
              v-else
              class="shadow-md text-center w-full bg-linear-to-r from-red-600 to-gray-700 text-white border-1 rounded-2xl my-5 p-5 flex flex-col">
            <h2 class="xl:text-5xl lg:text-5xl md:text-5xl text-3xl  font-bold leading-15">Sorry!, you are not eligible
              to access our aid</h2>
          </div>

          <UButton @click="state.showCalculator = true" color="neutral" class="font-bold rounded-full self-center"
                   icon="i-lucide-rocket">Close
          </UButton>

        </div>

      </div>
    </div>


    <div class="my-5">

    </div>

    <div
        class="w-full xl:w-2/3 md:w-4/5 lg:w-2/3 mx-auto footer mt-32 flex flex-col bg-linear-to-r/hsl from-indigo-500 to-blue-400 border-1 border-gray-200 rounded-3xl py-20 text-center justify-center">
      <h5 class="text-blue-100 font-bold">RentBase</h5>
      <small class="text-gray-50">&copy;2025. All Rights Reserved</small>
    </div>


  </main>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from '@nuxt/ui'

enum EmploymentType {
  Private = 'Private',
  Government = 'Government',
  SelfEmployment = 'Self Employment',
}

type RentLoanDetails = {
  principal: number;    // Rent amount to borrow
  rate: number;
  monthlySalary: number;// Annual interest rate in %
  durationInMonths: number;  // Repayment period in months
};

const items = ref([EmploymentType.Private.toString(), EmploymentType.Government, EmploymentType.SelfEmployment])
const value = ref(EmploymentType.Private)

const schema = v.object({
  employmentType: v.pipe(v.string(), v.string('Invalid email')),
  rentAmountPerMonth: v.pipe(v.number(), v.number('Invalid email')),
  netMonthlySalary: v.pipe(v.number(), v.number('Invalid email')),
  rentDurationPerMonth: v.pipe(v.number(), v.toMinValue(2)),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  employmentType: EmploymentType.Private,
  rentAmountPerMonth: 0.0,
  netMonthlySalary: 0.0,
  rentDurationPerMonth: 0.0,
  expectedMonthlyRent: {} as RentLoanDetailsResponse,
  showCalculator: true
})

type RentLoanDetailsResponse = {
  principal: number;
  interest: number;
  totalRepayment: number;
  monthlyRepayment: number;
  amountDueBeforeMoveIn: number;
  refundableDeposit: number;
  isElligible: boolean;
};

function roundUpToTwoDecimals(value: number): number {
  return Math.ceil(value * 100) / 100;
}

function formatMoney(amount: number, currency: string = 'GHS'): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function calculateRentLoan({principal, rate, durationInMonths, monthlySalary}: RentLoanDetails) {
  const timeInYears = durationInMonths / 12;
  const interest = (principal * rate * timeInYears) / 100;
  const totalRepayment = roundUpToTwoDecimals(principal + interest);
  const monthlyRepayment = roundUpToTwoDecimals(totalRepayment / durationInMonths);
  const isElligible = (monthlySalary >= principal * 3)
  const refundableDeposit = (5 * (durationInMonths * principal)) / 100;
  const amountDueBeforeMoveIn = totalRepayment + refundableDeposit;

  return {
    principal,
    interest,
    totalRepayment,
    monthlyRepayment,
    amountDueBeforeMoveIn,
    refundableDeposit,
    isElligible
  };
}


const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  state.showCalculator = false
  // toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
  console.log(event.data)
  console.log(state.rentAmountPerMonth)

  state.expectedMonthlyRent = calculateRentLoan({
    principal: state.rentAmountPerMonth,
    rate: 10,
    durationInMonths: state.rentDurationPerMonth,
    monthlySalary: state.netMonthlySalary,
  })

}
</script>

<style scoped>

</style>
