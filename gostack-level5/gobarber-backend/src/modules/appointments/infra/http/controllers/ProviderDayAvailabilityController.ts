import { Request, Response } from 'express'

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService'
import { container } from 'tsyringe'

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params
    const { day, month, year } = request.query

    const listProvidersDayAvailability = container.resolve(
      ListProviderDayAvailabilityService
    )

    const providers = await listProvidersDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    })

    return response.json(providers)
  }
}
