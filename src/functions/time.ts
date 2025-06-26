import { Temporal } from 'temporal-polyfill'

export const isBetween = (
  test: Temporal.PlainTime | string,
  before: Temporal.PlainTime | string,
  after: Temporal.PlainTime | string,
) => {
  if (typeof test === 'string') test = Temporal.PlainTime.from(test)
  if (typeof before === 'string') before = Temporal.PlainTime.from(before)
  if (typeof after === 'string') after = Temporal.PlainTime.from(after)

  return (
    Temporal.PlainTime.compare(test, before) !== -1 &&
    Temporal.PlainTime.compare(after, test) !== -1
  )
}

export const isBefore = (test: Temporal.PlainTime | string, after: Temporal.PlainTime | string) => {
  if (typeof test === 'string') test = Temporal.PlainTime.from(test)
  if (typeof after === 'string') after = Temporal.PlainTime.from(after)

  return Temporal.PlainTime.compare(test, after) - 1
}
