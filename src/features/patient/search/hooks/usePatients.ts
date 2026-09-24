// src/features/patient/search/hooks/usePatients.ts
import { useEffect, useState } from 'react'
import { listPatients } from '../../api/patients'
import type { Patient } from '../../types'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    listPatients(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setPatients(data)
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [revision])

  function refresh() {
    setLoading(true)
    setFailed(false)
    setPatients([])
    setRevision((value) => value + 1)
  }

  return { patients, loading, failed, refresh }
}
